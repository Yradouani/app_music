<?php

// namespace App\Controller;

// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\Routing\Annotation\Route;

// class HomeController extends AbstractController
// {
//     #[Route('/', name: 'home.index')]
//     public function index(): Response
//     {
//         return $this->render('home/home.html.twig', [
//             'controller_name' => 'HomeController',
//         ]);
//     }
// }



namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

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
        $user = new User();
        $user->setPseudo($request->request->get('pseudo'));
        $user->setEmail($request->request->get('email'));
        $user->setPassword(password_hash($request->request->get('password'), PASSWORD_DEFAULT));
        $user->setRoles(['ROLE_USER']);
        $user->setIsAdmin(false);
        // Enregistrement de l'utilisateur dans la base de données

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->redirectToRoute('home.index');
    }


    #[Route('/connexion', name: 'home.connexion', methods: ['POST'])]
    public function connexion(Request $request, EntityManagerInterface $entityManager, SessionInterface $session): Response
    {
        // on recupère le post
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        // on recupère les donnés de l'utilisateur possédant le mail
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        // Si l'utilisateur n'existe pas, on renvoie une erreur
        if (!$user) {
            throw new AuthenticationException('Email ou mot de passe invalide.');
        }

        // Si le mot de passe ne correspond pas, renvoyer une erreur
        if (!password_verify($password, $user->getPassword())) {
            throw new AuthenticationException('Email ou mot de passe invalide.');
        }

        // Si tout est ok, connecter l'utilisateur et démarrer une session utilisateur
        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $session->set('_security_main', serialize($token));

        return $this->redirectToRoute('home.index');
    }




    //     #[Route('/connexion', name: 'home.connexion', methods: ['POST'])]
    //     public function connexion(Request $request): Response
    //     {
    //         $email = $request->request->get('email');
    //         $password = $request->request->get('password');

    //         $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => $email]);

    //         if (!$user || !password_verify($password, $user->getPassword())) {
    //             $error = 'Invalid email or password';
    //         } else {
    //             // authenticate the user
    //             $this->getUser($user);
    //             return $this->redirectToRoute('discovery.index');
    //         }

    //         return $this->render('discovery/discovery.html.twig', [
    //             'last_email' => $email,
    //             'error' => $error ?? null,
    //         ]);
    //     }


    // 
}
