<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Track;
use App\Entity\Favorite;
use App\Entity\Playlist;
use Doctrine\ORM\EntityManager;
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
    public function index(Request $request, EntityManagerInterface $entityManager, SessionInterface $session, Security $security): Response
    {

        $isAlreadyInPlaylist = false;
        $trackAdded = false;
        $optionSelected = false;
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


        $idUser = $session->get('idUser');
        if (isset($idUser)) {
            $userRepository = $entityManager->getRepository(User::class);
            $user = $userRepository->find($idUser);
            $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

            $favoriteRepository = $entityManager->getRepository(Favorite::class);
            $favoriteList = $favoriteRepository->findBy(['id_user' => $user]);

            return $this->render('discovery/discovery.html.twig', [
                'playlists' => $playlists,
                'isAlreadyInPlaylist' => $isAlreadyInPlaylist,
                'trackAdded' => $trackAdded,
                'pseudo' => $user->getPseudo(),
                'optionSelected' => $optionSelected,
                'favoriteList' => $favoriteList,
            ]);
        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route('/discoveryFavoriteTrack', name: 'discoveryFavoriteTrack.index')]
    public function discovery(Request $request, SessionInterface $session, EntityManagerInterface $manager): JsonResponse
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
}
