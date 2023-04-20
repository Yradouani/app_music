<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'favorite.index')]
    public function index(): Response
    {
        return $this->render('favorite/favorite.html.twig', [
            'controller_name' => 'FavoriteController',
        ]);
    }

    #[Route('/addFavorite', name: 'addFavorite.index')]
    public function addFavorite(Request $request, EntityManagerInterface $manager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $songId= $data['songId'];

        $userRepository = $manager->getRepository(User::class);
        $user = $userRepository->find(1);

        $favorite = new Favorite();
        $favorite->setIdUser($user);
        $favorite->setIdTrack($songId);

        $manager->persist($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $songId]);
    }

    #[Route('/deleteFavorite/{id}', name: 'addFavorite.index')]
    public function deleteFavorite(Favorite $favorite, Request $request, EntityManagerInterface $manager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $songId= $data['songId'];

        $userRepository = $manager->getRepository(User::class);
        $user = $userRepository->find(1);

        $favorite = new Favorite();
        $favorite->setIdUser($user);
        $favorite->setIdTrack($songId);

        $manager->persist($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $songId]);
    }
}