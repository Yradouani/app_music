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
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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
    
    #[Route("/admin/user/{id}/delete", name:"admin.delete_user")]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): Response
    {
        $entityManager->remove($user);
        $entityManager->flush();

        $this->addFlash('success', 'User deleted successfully.');

        return $this->redirectToRoute('admin.index');
    }
}