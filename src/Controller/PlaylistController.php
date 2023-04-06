<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaylistController extends AbstractController
{
    #[Route('/playlists', name: 'playlist.index')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find(1);
        dump($user);

        $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);
        dump($playlists);

        return $this->render('playlist/playlist.html.twig', [
            'playlists' => $playlists
        ]);
    }

    #[Route('/addplaylists', name: 'addplaylist.index')]
    public function addPlaylist(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => 1]);
            $namePlaylist = $request->request->get('name_playlist');
            $isUsed = false;
            foreach ($playlists as $playlist) {
                if ($playlist->getNamePlaylist() == $namePlaylist) {
                    $isUsed = true;
                }
            }
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

        $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => 1]);
        return $this->render('playlist/playlist.html.twig', [
            'playlists' => $playlists,
            'isUsed' => $isUsed
        ]);
    }

    #[Route('/playlists/{id}', name: 'onePlaylist')]
    public function show(Request $request): Response
    {
        $id = $request->get('id');

        return $this->render('playlist/playlist.html.twig', [
            'controller_name' => 'PlaylistController',
            'id' => $id
        ]);
    }
}
