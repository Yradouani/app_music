<?php

// namespace App\Controller;

// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\Routing\Annotation\Route;

// class AdminController extends AbstractController
// {
//     #[Route('/admin', name: 'admin.index')]
//     public function index(): Response
//     {
//         return $this->render('admin/admin.html.twig', [
//             'controller_name' => 'AdminController',
//         ]);
//     }
// }
// src/Controller/AdminController.php

// src/Controller/AdminController.php

// src/Controller/AdminController.php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Repository\PlaylistRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin.index')]
    public function index(UserRepository $userRepository, PlaylistRepository $playlistRepository): Response
    {
        $numberOfUsers = $userRepository->count([]);
        $numberOfPlaylists = $playlistRepository->count([]);

        $users = $userRepository->findAll();

        return $this->render('admin/admin.html.twig', [
            'numberOfUsers' => $numberOfUsers,
            'numberOfPlaylists' => $numberOfPlaylists,
            'users' => $users,
        ]);
    }
}

