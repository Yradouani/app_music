<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home.index')]
    public function index(): Response
    {
        return $this->render('home/home.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/inscription', name: 'home.inscription', methods: ['POST'])]
    public function inscription(Request $request, EntityManagerInterface $entityManager): Response
    {
        $pseudo = $request->request->get('pseudo');
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        // Création d'un nouvel utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setPseudo($pseudo);
        $user->setPassword(password_hash($password, PASSWORD_DEFAULT)); // Hashage du mot de passe
        $user->setRoles(['ROLE_USER']);
        $user->setIsAdmin(false);
        // Enregistrement de l'utilisateur dans la base de données
        $entityManager->persist($user);
        $entityManager->flush();

        // Redirection vers une page de confirmation d'inscription
        return $this->redirectToRoute('home.confirmation');
    }

    #[Route('/inscription/confirmation', name: 'home.confirmation')]
    public function confirmation(): Response
    {
        return $this->render('home/confirmation.html.twig');
    }
}

