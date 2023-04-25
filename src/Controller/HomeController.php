<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\JsonResponse;


class HomeController extends AbstractController
{
    #[Route('/', name: 'home.index')]
    public function index(SessionInterface $session): Response
    {
        $idUser = $session->get('idUser');
        if (isset($idUser)) {
            return $this->redirectToRoute('discovery.index');
        } else {
            return $this->render('home/home.html.twig', [
                'controller_name' => 'HomeController',
            ]);
        }
    }

    #[Route('/inscription', name: 'home.inscription', methods: ['POST'])]
    public function inscription(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
    {
        $pseudo = $request->request->get('pseudo');
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        // Vérification de la complexité du mot de passe
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) {
            // Le mot de passe ne répond pas aux exigences de complexité
            // $this->addFlash('error', 'Le mot de passe doit contenir au minimum une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial et minimum 8 caractères.');
            $result = 'error-password';
            return $this->render('home/home.html.twig', [
                'controller_name' => 'HomeController',
                'result' => $result
            ]);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user) {
            // Un utilisateur avec le même email existe déjà
            // $this->addFlash('error', 'Cet email est déjà utilisé.');
            $result = 'error-mail';
            return $this->render('home/home.html.twig', [
                'controller_name' => 'HomeController',
                'result' => $result
            ]);
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
        // $message = "Hello World";
        // return new JsonResponse($message);
        $result = 'success';
        return $this->render('home/home.html.twig', [
            'controller_name' => 'HomeController',
            'result' => $result
        ]);
    }

    #[Route('/connexion', name: 'home.connexion', methods: ['POST'])]
    public function connexion(Request $request, UserRepository $userRepository, SessionInterface $session): Response
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || !password_verify($password, $user->getPassword())) {
            // Email ou mot de passe invalide
            $this->addFlash('error', 'Email ou mot de passe invalide.');
            return $this->render('home/home.html.twig', [
                'controller_name' => 'HomeController',
            ]);
        }
        $session->set('roleUser', $user->getRoles());
        $session->set('idUser', $user->getId());

        // Connexion réussie
        return $this->redirectToRoute('discovery.index');
    }

    #[Route('/discovery', name: 'discovery')]
    public function discovery(Request $request): Response
    {
        return $this->render('discovery.html.twig');
    }
}
