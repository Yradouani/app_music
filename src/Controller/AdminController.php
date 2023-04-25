<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\PlaylistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AdminController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/admin', name: 'admin.index')]
    public function index(UserRepository $userRepository, PlaylistRepository $playlistRepository, SessionInterface $session, EntityManagerInterface $entityManager): Response
    {
        $numberOfUsers = $userRepository->count([]);
        $numberOfPlaylists = $playlistRepository->count([]);
        $numberOfFavorites = $this->getNumberOfFavorites();


        $users = $userRepository->findAll();
        $idUser = $session->get('idUser');

        if (isset($idUser)) {
            $userRepository = $entityManager->getRepository(User::class);
            $user = $userRepository->find($idUser);
            $role = $session->get('roleUser')[0];
            if ($role == "ROLE_ADMIN") {
                return $this->render('admin/admin.html.twig', [
                    'numberOfUsers' => $numberOfUsers,
                    'numberOfPlaylists' => $numberOfPlaylists,
                    'numberOfFavorites' => $numberOfFavorites,
                    'users' => $users,
                    'pseudo' => $user->getPseudo(),
                ]);
            } else {
                return $this->redirectToRoute('discovery.index');
            }
        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route("/admin/user/{id}/delete", name: "admin.delete_user")]
    public function deleteUser(User $user, SessionInterface $session, UserRepository $userRepository): Response
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();

        $this->addFlash('erase', 'User deleted successfully.');
        return $this->redirectToRoute('admin.index');
    }

    private function getNumberOfFavorites()
    {
        $numberOfFavorites = $this->entityManager->createQuery('SELECT COUNT(f.id) FROM App\Entity\Favorite f')->getSingleScalarResult();
        return $numberOfFavorites;
    }
}
