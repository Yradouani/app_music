<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230424074437 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED979F37AE5');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED979F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE playlist DROP FOREIGN KEY FK_D782112D79F37AE5');
        $this->addSql('ALTER TABLE playlist ADD CONSTRAINT FK_D782112D79F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED979F37AE5');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED979F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE playlist DROP FOREIGN KEY FK_D782112D79F37AE5');
        $this->addSql('ALTER TABLE playlist ADD CONSTRAINT FK_D782112D79F37AE5 FOREIGN KEY (id_user_id) REFERENCES user (id)');
    }
}
