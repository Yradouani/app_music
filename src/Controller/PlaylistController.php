<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Entity\Track;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaylistController extends AbstractController
{
    #[Route('/playlists', name: 'playlist.index')]
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
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

        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find(1);
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


        return $this->render('playlist/playlist.html.twig', [
            'playlists' => $playlists,
            'tracks_info' => $tracks_info
        ]);
    }

    #[Route('/addplaylists', name: 'addplaylist.index')]
    public function addPlaylist(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => 1]);
            $namePlaylist = $request->request->get('name_playlist');
            $isUsed = false;

            if ($isUsed == false) {
                $userRepository = $entityManager->getRepository(User::class);
                $user = $userRepository->find(1);

                $playlist = new Playlist();
                $playlist->setNamePlaylist($namePlaylist);
                $playlist->setIdUser($user);
                $entityManager->persist($playlist);
                $entityManager->flush();
            }
        }

        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find(1);
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

        return $this->render('playlist/playlist.html.twig', [
            'playlists' => $playlists,
            'isUsed' => $isUsed,
            'tracks_info' => $tracks_info
        ]);
    }

    #[Route('/playlists/{id}', name: 'onePlaylist')]
    public function show(Request $request, EntityManagerInterface $entityManager): Response
    {
        $id = $request->get('id');

        $playlistRepository = $entityManager->getRepository(Playlist::class);
        $playlist = $playlistRepository->find($id);
        $tracks = $entityManager->getRepository(Track::class)->findBy(['id_playlist' => $playlist]);
        $lastTrack = end($tracks);
        $tracks_api_response = [];
        $url = "";

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

        return $this->render('playlist/playlist.html.twig', [
            'id' => $id,
            'tracks_api_response' => $tracks_api_response,
        ]);
    }
}
