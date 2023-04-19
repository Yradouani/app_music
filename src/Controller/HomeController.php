<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;


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
    public function inscription(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
{
    $pseudo = $request->request->get('pseudo');
    $email = $request->request->get('email');
    $password = $request->request->get('password');

    $user = $userRepository->findOneBy(['email' => $email]);

    if ($user) {
        // Un utilisateur avec le même email existe déjà
        $this->addFlash('error', 'Cet email est déjà utilisé.');
        return $this->redirectToRoute('home.index');
    }

    $user = new User();
    $user->setPseudo($pseudo);
    $user->setEmail($email);
    $user->setPassword(password_hash($password, PASSWORD_DEFAULT));
    $user->setRoles(['ROLE_USER']);
    $user->setIsAdmin(false);

    $entityManager->persist($user);
    $entityManager->flush();

    // Redirection vers la page d'accueil
    $this->addFlash('success', 'Inscription réussie !');

    return $this->redirectToRoute('home.index');
}

    
    
    #[Route('/connexion', name: 'home.connexion', methods: ['POST'])]
    public function connexion(Request $request, UserRepository $userRepository): Response
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            // Email ou mot de passe invalide
            return $this->render('home/home.html.twig', [
                'controller_name' => 'HomeController',
                'error' => "Email ou mot de passe invalide.",
            ]);
        }

        // Connexion réussie
        return $this->redirectToRoute('discovery', [
            'pseudo' => $user->getPseudo(),
        ]);
    }

    #[Route('/discovery', name: 'discovery')]
    public function discovery(Request $request): Response
    {
        $pseudo = $request->query->get('pseudo');
        return $this->render('discovery.html.twig', [
            'pseudo' => $pseudo,
        ]);
    }
}
