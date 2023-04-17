<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Playlist;
use App\Entity\User;
use Symfony\Component\Routing\Annotation\Route;

class DiscoveryController extends AbstractController
{
    #[Route('/discovery', name: 'discovery.index')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find(1);
        $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

        return $this->render('discovery/discovery.html.twig', [
            'playlists' => $playlists
        ]);
    }
}
