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
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin.index')]
    public function index(UserRepository $userRepository, PlaylistRepository $playlistRepository, SessionInterface $session): Response
    {
        $numberOfUsers = $userRepository->count([]);
        $numberOfPlaylists = $playlistRepository->count([]);

        $users = $userRepository->findAll();
        $idUser = $session->get('idUser');

        if (isset($idUser)) {
            $role = $session->get('roleUser')[0];
            if ($role == "ROLE_ADMIN") {
                return $this->render('admin/admin.html.twig', [
                    'numberOfUsers' => $numberOfUsers,
                    'numberOfPlaylists' => $numberOfPlaylists,
                    'users' => $users,
                ]);
            } else {
                return $this->redirectToRoute('discovery.index');
            }
        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route("/admin/user/{id}/delete", name: "admin.delete_user")]
    public function deleteUser(User $user, EntityManagerInterface $entityManager, SessionInterface $session): Response
    {
        // $idUser = $session->get('idUser');
        // $role = $session->get('roleUser')[0];
        // if ($role == "ROLE_ADMIN" and isset($idUser)) {
        $entityManager->remove($user);
        $entityManager->flush();

        $this->addFlash('erase', 'User deleted successfully.');
        return $this->redirectToRoute('admin.index');
        // } else {
        // }
    }
}
