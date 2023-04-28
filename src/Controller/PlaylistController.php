<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Track;
use App\Entity\Playlist;
use App\Entity\Favorite;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PlaylistController extends AbstractController
{
    #[Route('/playlists', name: 'playlist.index')]
    public function index(Request $request, EntityManagerInterface $entityManager, SessionInterface $session, UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();
        $idUser = $session->get('idUser');
        $isExistUser = false;

        for ($i = 0; $i < count($users); $i++) {
            if ($users[$i]->getId() == $idUser) {
                $isAlreadyInPlaylist = false;
                $isExistUser = true;
                if ($request->isMethod('POST')) {
                    if ($request->request->get('track_id') !== null) {
                        $track_id = $request->request->get('track_id');
                        $idPlaylist = $request->request->get('playlist');
                        if ($track_id) {
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

                    if ($request->request->get('playlist_id') !== null) {
                        $playlist_id = $request->request->get('playlist_id');
                        $playlistRepository = $entityManager->getRepository(Playlist::class);
                        $playlist = $playlistRepository->find($playlist_id);

                        if (!$playlist) {
                            throw $this->createNotFoundException('Playlist non trouvée');
                        } else {
                            $entityManager->remove($playlist);
                            $entityManager->flush();
                        }
                    }
                }

                $userRepository = $entityManager->getRepository(User::class);
                if (isset($idUser)) {
                    $user = $userRepository->find($idUser);
                } else {
                    return $this->redirectToRoute('home.index');
                }

                $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

                $tracks_info = [];

                for ($i = 0; $i < count($playlists); $i++) {
                    $tracks = $entityManager->getRepository(Track::class)->findBy(['id_playlist' => $playlists[$i]->getId()]);
                    if ($tracks) {
                        $lastTrack = end($tracks);
                        $url = 'https://api.deezer.com/track/' . $lastTrack->getNumTrack();
                        $context = stream_context_create([
                            "http" => [
                                "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3\r\n"
                            ]
                        ]);
                        $response = file_get_contents($url, false, $context);
                        $data = json_decode($response, true);
                        $tracks_info[$i] = $data;
                        sleep(1);
                    } else {
                        $tracks_info[$i] = null;
                    }
                }

                if (isset($idUser)) {
                    return $this->render('playlist/playlist.html.twig', [
                        'playlists' => $playlists,
                        'tracks_info' => $tracks_info,
                        'isAlreadyInPlaylist' => $isAlreadyInPlaylist,
                        'pseudo' => $user->getPseudo(),
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

    #[Route('/addplaylists', name: 'addplaylist.index')]
    public function addPlaylist(Request $request, EntityManagerInterface $entityManager, SessionInterface $session): Response
    {
        $idUser = $session->get('idUser');
        $isUsed = false;
        $isValidPlaylistName = true;
        $tracks_info = [];
        if ($request->isMethod('POST')) {
            $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $idUser]);
            $namePlaylist = $request->request->get('name_playlist');
            if ($namePlaylist == "") {
                $isValidPlaylistName = false;
            } else {
                foreach ($playlists as $playlist) {
                    if ($playlist->getNamePlaylist() == $namePlaylist) {
                        $isUsed = true;
                        break;
                    }
                }
                if (($isUsed == false) && ($isValidPlaylistName == true)) {
                    $userRepository = $entityManager->getRepository(User::class);
                    if (isset($idUser)) {
                        $user = $userRepository->find($idUser);
                    } else {
                        return $this->redirectToRoute('home.index');
                    }
                    $playlist = new Playlist();
                    $playlist->setNamePlaylist($namePlaylist);
                    $playlist->setIdUser($user);
                    $entityManager->persist($playlist);
                    $entityManager->flush();
                }
            }
            // return $this->redirectToRoute('playlist.index');
        }

        $userRepository = $entityManager->getRepository(User::class);

        if (isset($idUser)) {
            $user = $userRepository->find($idUser);
        } else {
            return $this->redirectToRoute('home.index');
        }
        $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

        for ($i = 0; $i < count($playlists); $i++) {
            $tracks = $entityManager->getRepository(Track::class)->findBy(['id_playlist' => $playlists[$i]->getId()]);
            if ($tracks) {
                $lastTrack = end($tracks);
                $url = 'https://api.deezer.com/track/' . $lastTrack->getNumTrack();
                $context = stream_context_create([
                    "http" => [
                        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3\r\n"
                    ]
                ]);
                $response = file_get_contents($url, false, $context);
                $data = json_decode($response, true);
                $tracks_info[$i] = $data;
                sleep(1);
            } else {
                $tracks_info[$i] = null;
            }
        }

        return $this->render('playlist/playlist.html.twig', [
            'playlists' => $playlists,
            'isUsed' => $isUsed,
            'tracks_info' => $tracks_info,
            'isValidPlaylistName' => $isValidPlaylistName,
            'pseudo' => $user->getPseudo(),
        ]);
    }

    #[Route('/playlists/{id}', name: 'onePlaylist')]
    public function show(Request $request, EntityManagerInterface $entityManager, SessionInterface $session): Response
    {
        $id = $request->get('id');
        $idUser = $session->get('idUser');
        $playlistRepository = $entityManager->getRepository(Playlist::class);
        $playlist = $playlistRepository->find($id);
        $tracks = $entityManager->getRepository(Track::class)->findBy(['id_playlist' => $playlist]);
        $lastTrack = end($tracks);
        $tracks_api_response = [];
        $url = "";

        $userRepository = $entityManager->getRepository(User::class);
        if (isset($idUser)) {
            $user = $userRepository->find($idUser);
        } else {
            return $this->redirectToRoute('home.index');
        }

        for ($i = 0; $i < count($tracks); $i++) {
            $url = 'https://api.deezer.com/track/' . $tracks[$i]->getNumTrack();
            $context = stream_context_create([
                "http" => [
                    "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3\r\n"
                ]
            ]);
            $response = file_get_contents($url, false, $context);
            $data = json_decode($response, true);
            $tracks_api_response[$i] = $data;
            sleep(1);
        }

        $idUser = $session->get('idUser');
        if (isset($idUser)) {
            $userRepository = $entityManager->getRepository(User::class);
            $user = $userRepository->find($idUser);

            $favoriteRepository = $entityManager->getRepository(Favorite::class);
            $favoriteList = $favoriteRepository->findBy(['id_user' => $user]);
        }


        return $this->render('playlist/playlist.html.twig', [
            'id' => $id,
            'tracks_api_response' => $tracks_api_response,
            'playlist' => $playlist,
            'favoriteList' => $favoriteList,
            'pseudo' => $user->getPseudo(),
        ]);
    }

    #[Route('/deleteplaylist', name: 'deleteplaylist.index')]
    public function deletePlaylist(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $idPlaylistToDelete = $data['idPlaylistToDelete'];
        $idTrackToDelete = $data['idTrackToDelete'];

        $track = $entityManager->getRepository(Track::class)->findOneBy([
            'num_track' => $idTrackToDelete,
            'id_playlist' => $idPlaylistToDelete
        ]);

        if (!$track) {
            throw $this->createNotFoundException('Track non trouvée');
        } else {
            $entityManager->remove($track);
            $entityManager->flush();
            $response = $this->redirectToRoute('playlist.index');
            $response->headers->set('Cache-Control', 'no-store');

            return $response;
        }
    }
}
