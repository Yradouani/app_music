<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiscoveryController extends AbstractController
{
    #[Route('/discovery', name: 'discovery.index')]
    public function index(): Response
    {
        return $this->render('discovery/discovery.html.twig', [
            'controller_name' => 'DiscoveryController',
        ]);
    }
}
