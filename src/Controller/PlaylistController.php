<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PlaylistController extends AbstractController
{
    #[Route('/playlists', name: 'playlist.index')]
    public function index(): Response
    {
        return $this->render('playlist/playlist.html.twig', [
            'controller_name' => 'PlaylistController',
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
