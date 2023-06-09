<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Track;
use App\Entity\Favorite;
use App\Entity\Playlist;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DiscoveryController extends AbstractController
{
    #[Route('/discovery', name: 'discovery.index')]
    public function index(Request $request, EntityManagerInterface $entityManager, SessionInterface $session, Security $security, UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();
        $idUser = $session->get('idUser');
        $isExistUser = false;


        for ($i = 0; $i < count($users); $i++) {
            if ($users[$i]->getId() == $idUser) {
                $isAlreadyInPlaylist = false;
                $trackAdded = false;
                $optionSelected = false;
                $isExistUser = true;
                if ($request->isMethod('POST')) {
                    $track_id = $request->request->get('track_id');
                    $idPlaylist = $request->request->get('playlist');
                    if ($track_id) {
                        $optionSelected = true;
                        $playlistRepository = $entityManager->getRepository(Playlist::class);
                        $playlist = $playlistRepository->find($idPlaylist);
                        $tracks = $entityManager->getRepository(Track::class)->findBy(['num_track' => $track_id]);
                        foreach ($tracks as $track) {
                            if ($track->getIdPlaylist() == $playlist) {
                                $isAlreadyInPlaylist = true;
                            }
                        }
                        if ($isAlreadyInPlaylist == false) {
                            $playlistRepository = $entityManager->getRepository(Playlist::class);
                            $playlist = $playlistRepository->find($idPlaylist);

                            $newTrack = new Track();
                            $newTrack->setIdPlaylist($playlist);
                            $newTrack->setNumTrack($track_id);
                            $entityManager->persist($newTrack);
                            $entityManager->flush();
                            $trackAdded = true;
                        }
                    }
                }

                if (isset($idUser)) {
                    $userRepository = $entityManager->getRepository(User::class);
                    $user = $userRepository->find($idUser);
                    $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

                    return $this->render('discovery/discovery.html.twig', [
                        'playlists' => $playlists,
                        'isAlreadyInPlaylist' => $isAlreadyInPlaylist,
                        'trackAdded' => $trackAdded,
                        'pseudo' => $user->getPseudo(),
                        'optionSelected' => $optionSelected,
                    ]);
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

    #[Route('/discoveryFavoriteTrack', name: 'discoveryFavoriteTrack.index')]
    public function favoriteDiscovery(SessionInterface $session, EntityManagerInterface $manager): JsonResponse
    {
        $idUser = $session->get('idUser');
        if (isset($idUser)) {

            $userRepository = $manager->getRepository(User::class);
            $user = $userRepository->find($idUser);

            $favoriteRepository = $manager->getRepository(Favorite::class);
            $favoriteList = $favoriteRepository->findBy(['id_user' => $user]);

            // $favoriteTab = [];
            // foreach ($favoriteList as $favorite) {
            //     $favoriteListJson = [
            //         "id_track" => $favorite->getIdTrack()
            //     ];
            //     array_push($favoriteTab, $favoriteListJson);
            // }

            $favoriteListJson = [];
            foreach ($favoriteList as $favorite) {
                $jsonList = [
                    "id_track" => $favorite->getIdTrack(),
                ];
                array_push($favoriteListJson, $jsonList);
            }

            try {
                // $favoriteList = json_encode($favoriteList);
                return new JsonResponse(['favoriteListJson' => $favoriteListJson]);
            } catch (Exception $e) {
                error_log('JSON encoding error: ' . $e->getMessage());
            }

            // return $this->render('discovery/discovery.html.twig', [
            //     'favoriteList' => $favoriteList,
            // ]);

            // var_dump($favoriteList);
            // die;


        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    // #[Route('/{url}', name: 'discoveryRedirect')]
    // public function discoveryRedirect(SessionInterface $session): Response
    // {
    //     if ($session->get('idUser')) {
    //         return $this->redirectToRoute('discovery.index');
    //     } else {
    //         // return $this->render('home/home.html.twig');
    //         return $this->redirectToRoute('home.index');
    //     }
    // }
}
