<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'favorite.index')]
    public function index(): Response
    {
        if (isset($idUser)) {
            return $this->render('favorite/favorite.html.twig', [
                'controller_name' => 'FavoriteController',
            ]);
        } else {
            return $this->redirectToRoute('home.index');
        }
    }
}
