# Application de musique en streaming

## Démarrer le projet

Pour utiliser l'application en locale, il est nécessaire d'avoir des versions récentes de **Composer, PHP, Symfony et MySQL** installées sur votre appareil.

**Suivez ces étapes :**

1.  Clonez le projet  
    `$ git clone https://github.com/Yradouani/app_music.git`

2.  Installez composer à la racine du projet  
    `$ composer install`

3.  Executez les migrations pour créer la base de données  
    `$ php bin/console doctrine:migration:migrate`

4.  Créez un fichier **.env.dev.local** à la racine du projet dans lequel il faut mettre l'url de la base de données
    `DATABASE_URL="mysql://user:password@127.0.0.1:3306/soundwave?serverVersion=8&charset=utf8mb4"`

    Remplacez user et password par vos propres identifiants

5.  Lancez le serveur symfony  
    `$ symfony server:start`

## Description

SoundWave est une application de musique en streaming (tel que Spotify) comprenant 3 rubriques :  
- une rubrique Découvertes, permettant d'explorer les dernières tendances,
- une rubrique Playlists, permettant à l'utilisateur de créer des playlists pour pouvoir y ajouter des musiques,
- une rubrique Favoris, permettant à l'utilisateur de retrouver les musiques qu'il a liké.

L'administrateur a en plus accès, à la rubrique admin, où il peut visualiser à la liste des utilisateurs inscrits et quelques statistiques.

## Technos 
  
- **Front :** HTML(Twig), CSS , JS (libs: SwiperJS, HowlerJS)   
- **Back :** Symfony/PHP, MySQL    
- **Api :** Deezer Api (avec RapidAPI)

## Contributeurs
  
Vianney Giovannelli | Thibaud Maître | Yasmine Radouani | Haroun Abdennabi 




