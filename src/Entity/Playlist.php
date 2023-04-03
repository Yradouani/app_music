<?php

namespace App\Entity;

use App\Repository\PlaylistRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlaylistRepository::class)]
class Playlist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $id_user = null;

    #[ORM\Column(length: 255)]
    private ?string $name_playlist = null;

    #[ORM\Column(length: 255)]
    private ?string $id_track = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?User
    {
        return $this->id_user;
    }

    public function setIdUser(?User $id_user): self
    {
        $this->id_user = $id_user;

        return $this;
    }

    public function getNamePlaylist(): ?string
    {
        return $this->name_playlist;
    }

    public function setNamePlaylist(string $name_playlist): self
    {
        $this->name_playlist = $name_playlist;

        return $this;
    }

    public function getIdTrack(): ?string
    {
        return $this->id_track;
    }

    public function setIdTrack(string $id_track): self
    {
        $this->id_track = $id_track;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }
}
