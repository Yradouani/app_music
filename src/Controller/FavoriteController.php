<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Favorite;
use App\Entity\Playlist;
use App\Entity\Track;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'favorite.index')]
    public function index(SessionInterface $session, EntityManagerInterface $manager, Request $request, UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();
        $idUser = $session->get('idUser');
        $isExistUser = false;

        for ($i = 0; $i < count($users); $i++) {
            if ($users[$i]->getId() == $idUser) {
                $isExistUser = true;

                if (isset($idUser)) {

                    $userRepository = $manager->getRepository(User::class);
                    $user = $userRepository->find($idUser);
                    $playlists = $manager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

                    if ($request->isMethod('POST')) {
                        $isAlreadyInPlaylist = false;
                        if ($request->request->get('track_id') !== null) {
                            $track_id = $request->request->get('track_id');
                            $idPlaylist = $request->request->get('playlist');
                            if ($track_id) {
                                $playlistRepository = $manager->getRepository(Playlist::class);
                                $playlist = $playlistRepository->find($idPlaylist);
                                $tracks = $manager->getRepository(Track::class)->findBy(['num_track' => $track_id]);
                                foreach ($tracks as $track) {
                                    if ($track->getIdPlaylist() == $playlist) {
                                        $isAlreadyInPlaylist = true;
                                    }
                                }
                                if ($isAlreadyInPlaylist == false) {
                                    $playlistRepository = $manager->getRepository(Playlist::class);
                                    $playlist = $playlistRepository->find($idPlaylist);

                                    $newTrack = new Track();
                                    $newTrack->setIdPlaylist($playlist);
                                    $newTrack->setNumTrack($track_id);
                                    $manager->persist($newTrack);
                                    $manager->flush();
                                    $trackAdded = true;
                                }
                            }
                        }
                    }

                    $favoriteRepository = $manager->getRepository(Favorite::class);
                    $favoriteList = $favoriteRepository->findBy(['id_user' => $user]);

                    // var_dump($favoriteList);
                    // echo $favoriteList[0]->getIdTrack();

                    // $favorite = $favoriteList[0];
                    // $idTrack = $favorite->getIdTrack();
                    // echo $idTrack;

                    $responseTrack = [];

                    for ($i = 0; $i < count($favoriteList); $i++) {
                        $idTrack = $favoriteList[$i]->getIdTrack();
                        $url = 'https://api.deezer.com/track/' . $idTrack;
                        $option = [
                            'http' => [
                                'method' => 'GET'
                            ]
                        ];
                        $context = stream_context_create($option);
                        $response = file_get_contents($url, false, $context);
                        $responseTrack[$i] = json_decode($response, true);
                    }


                    if ($responseTrack === false) {
                        $errorGetContent = "Une erreur s'est produite au chargement des Favoris, veuillez recharger la page.";
                        return $this->render('favorite/favorite.html.twig', [
                            'controller_name' => 'FavoriteController',
                            'userNum' => $user,
                            'errorGetContent' => $errorGetContent,
                            'playlists' => $playlists,
                            'isAlreadyInPlaylist' => isset($isAlreadyInPlaylist) ? $isAlreadyInPlaylist : "",
                            'pseudo' => $user->getPseudo(),
                            'favoriteList' => $favoriteList,

                        ]);
                    } else {
                        return $this->render('favorite/favorite.html.twig', [
                            'controller_name' => 'FavoriteController',
                            'userNum' => $user,
                            'responseTrack' => $responseTrack,
                            'playlists' => $playlists,
                            'isAlreadyInPlaylist' => isset($isAlreadyInPlaylist) ? $isAlreadyInPlaylist : "",
                            'pseudo' => $user->getPseudo(),
                            'favoriteList' => $favoriteList,
                        ]);
                    }
                } else {
                    return $this->redirectToRoute('home.index');
                }
                break;
            }
        }

        if ($isExistUser == false) {
            $session->remove('idUser');
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route('/addFavorite', name: 'addFavorite.index', methods: ['POST'])]
    public function addFavorite(Request $request, EntityManagerInterface $manager, SessionInterface $session): JsonResponse
    {

        $data = json_decode($request->getContent(), true);
        $songId = $data['songId'];

        $idUser = $session->get('idUser');

        $userRepository = $manager->getRepository(User::class);

        if (isset($idUser)) {
            $user = $userRepository->find($idUser);
        } else {
            return $this->redirectToRoute('home.index');
        }
        $favorite = new Favorite();
        $favorite->setIdUser($user);
        $favorite->setIdTrack($songId);

        $manager->persist($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $songId]);
    }

    #[Route('/deleteFavorite/{id}', name: 'deleteFavorite.index')]
    public function deleteFavorite(Request $request, EntityManagerInterface $manager, SessionInterface $session, $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $songId = $data['songId'];

        $userRepository = $manager->getRepository(User::class);
        $user = $userRepository->find($session->get('idUser'));

        $favorite = $manager->getRepository(Favorite::class)->findOneBy([
            'id_user' => $user,
            'id_track' => $songId
        ]);


        if (!$favorite) {
            return new JsonResponse(['error' => "La track n'est pas dans la liste des favoris"]);
        }

        $manager->remove($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $id]);
    }
}
