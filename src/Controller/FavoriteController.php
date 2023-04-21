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
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'favorite.index')]
    public function index(SessionInterface $session): Response
    {
        $idUser = $session->get('idUser');
        if (isset($idUser)) {
            return $this->render('favorite/favorite.html.twig', [
                'controller_name' => 'FavoriteController',
            ]);
        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route('/addFavorite', name: 'addFavorite.index', methods:['POST'])]
    public function addFavorite(Request $request, EntityManagerInterface $manager, SessionInterface $session): JsonResponse
    {

        $data = json_decode($request->getContent(), true);
        $songId= $data['songId'];

        $idUser = $session->get('idUser');

        $userRepository = $manager->getRepository(User::class);
        $user = $userRepository->find($idUser);

        $favorite = new Favorite();
        $favorite->setIdUser($user);
        $favorite->setIdTrack($songId);

        $manager->persist($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $songId]);
    }

    #[Route('/deleteFavorite/{id}', name: 'deleteFavorite.index')]
    public function deleteFavorite(Request $request, EntityManagerInterface $manager, SessionInterface $session, $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $songId = $data['songId'];

        $userRepository = $manager->getRepository(User::class);
        $user = $userRepository->find($session->get('idUser'));

        $favorite = $manager->getRepository(Favorite::class)->findOneBy([
            'id_user' => $user,
            'id_track' => $songId
        ]);


        if (!$favorite) {
            return new JsonResponse(['error' => "La track n'est pas dans la liste des favoris"]);
        }

        $manager->remove($favorite);
        $manager->flush();

        return new JsonResponse(['message' => $id]);
    }
}