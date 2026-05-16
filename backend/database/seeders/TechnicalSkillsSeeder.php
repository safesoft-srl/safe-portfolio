<?php

namespace Database\Seeders;

use App\Models\TechnicalSkill;
use Illuminate\Database\Seeder;

class TechnicalSkillsSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [

            // ====================== BACKEND ======================
            ['name' => 'Actix',     'category' => 'Backend', 'url_light' => 'iconskills/Actix-Light.svg',     'url_dark' => 'iconskills/Actix-Dark.svg'],
            ['name' => 'Adonis',    'category' => 'Backend', 'url_light' => 'iconskills/Adonis.svg',          'url_dark' => null],
            ['name' => 'Apollo',    'category' => 'Backend', 'url_light' => 'iconskills/Apollo.svg',         'url_dark' => null],
            ['name' => 'Appwrite',  'category' => 'Backend', 'url_light' => 'iconskills/Appwrite.svg',       'url_dark' => null],
            ['name' => 'Django',    'category' => 'Backend', 'url_light' => 'iconskills/Django.svg',         'url_dark' => null],
            ['name' => 'DotNet',    'category' => 'Backend', 'url_light' => 'iconskills/DotNet.svg',         'url_dark' => null],
            ['name' => 'Elixir',    'category' => 'Backend', 'url_light' => 'iconskills/Elixir-Light.svg',   'url_dark' => 'iconskills/Elixir-Dark.svg'],
            ['name' => 'ExpressJS', 'category' => 'Backend', 'url_light' => 'iconskills/ExpressJS-Light.svg', 'url_dark' => 'iconskills/ExpressJS-Dark.svg'],
            ['name' => 'FastAPI',   'category' => 'Backend', 'url_light' => 'iconskills/FastAPI.svg',        'url_dark' => null],
            ['name' => 'Flask',     'category' => 'Backend', 'url_light' => 'iconskills/Flask-Light.svg',    'url_dark' => 'iconskills/Flask-Dark.svg'],
            ['name' => 'GoLang',    'category' => 'Backend', 'url_light' => 'iconskills/GoLang.svg',         'url_dark' => null],
            ['name' => 'Java',      'category' => 'Backend', 'url_light' => 'iconskills/Java-Light.svg',     'url_dark' => 'iconskills/Java-Dark.svg'],
            ['name' => 'Kotlin',    'category' => 'Backend', 'url_light' => 'iconskills/Kotlin-Light.svg',   'url_dark' => 'iconskills/Kotlin-Dark.svg'],
            ['name' => 'Ktor',      'category' => 'Backend', 'url_light' => 'iconskills/Ktor-Light.svg',     'url_dark' => 'iconskills/Ktor-Dark.svg'],
            ['name' => 'Laravel',   'category' => 'Backend', 'url_light' => 'iconskills/Laravel-Light.svg',  'url_dark' => 'iconskills/Laravel-Dark.svg'],
            ['name' => 'NestJS',    'category' => 'Backend', 'url_light' => 'iconskills/NestJS-Light.svg',   'url_dark' => 'iconskills/NestJS-Dark.svg'],
            ['name' => 'NodeJS',    'category' => 'Backend', 'url_light' => 'iconskills/NodeJS-Light.svg',   'url_dark' => 'iconskills/NodeJS-Dark.svg'],
            ['name' => 'PHP',       'category' => 'Backend', 'url_light' => 'iconskills/PHP-Light.svg',      'url_dark' => 'iconskills/PHP-Dark.svg'],
            ['name' => 'Prisma',    'category' => 'Backend', 'url_light' => 'iconskills/Prisma.svg',         'url_dark' => null],
            ['name' => 'Python',    'category' => 'Backend', 'url_light' => 'iconskills/Python-Light.svg',   'url_dark' => 'iconskills/Python-Dark.svg'],
            ['name' => 'Rails',     'category' => 'Backend', 'url_light' => 'iconskills/Rails.svg',          'url_dark' => null],
            ['name' => 'Ruby',      'category' => 'Backend', 'url_light' => 'iconskills/Ruby.svg',           'url_dark' => null],
            ['name' => 'Rust',      'category' => 'Backend', 'url_light' => 'iconskills/Rust.svg',           'url_dark' => null],
            ['name' => 'Spring',    'category' => 'Backend', 'url_light' => 'iconskills/Spring-Light.svg',   'url_dark' => 'iconskills/Spring-Dark.svg'],
            ['name' => 'Symfony',   'category' => 'Backend', 'url_light' => 'iconskills/Symfony-Light.svg',  'url_dark' => 'iconskills/Symfony-Dark.svg'],

            // ====================== FRONTEND ======================
            ['name' => 'AlpineJS',   'category' => 'Frontend', 'url_light' => 'iconskills/AlpineJS-Light.svg',   'url_dark' => 'iconskills/AlpineJS-Dark.svg'],
            ['name' => 'Angular',    'category' => 'Frontend', 'url_light' => 'iconskills/Angular-Light.svg',    'url_dark' => 'iconskills/Angular-Dark.svg'],
            ['name' => 'Bootstrap',  'category' => 'Frontend', 'url_light' => 'iconskills/Bootstrap.svg',        'url_dark' => null],
            ['name' => 'CSS',        'category' => 'Frontend', 'url_light' => 'iconskills/CSS.svg',              'url_dark' => null],
            ['name' => 'HTML',       'category' => 'Frontend', 'url_light' => 'iconskills/HTML.svg',             'url_dark' => null],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'url_light' => 'iconskills/JavaScript.svg',       'url_dark' => null],
            ['name' => 'React',      'category' => 'Frontend', 'url_light' => 'iconskills/React-Light.svg',      'url_dark' => 'iconskills/React-Dark.svg'],
            ['name' => 'TailwindCSS', 'category' => 'Frontend', 'url_light' => 'iconskills/TailwindCSS-Light.svg', 'url_dark' => 'iconskills/TailwindCSS-Dark.svg'],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'url_light' => 'iconskills/TypeScript.svg',       'url_dark' => null],
            ['name' => 'VueJS',      'category' => 'Frontend', 'url_light' => 'iconskills/VueJS-Light.svg',      'url_dark' => 'iconskills/VueJS-Dark.svg'],

            // ====================== DEVOPS ======================
            ['name' => 'Docker',     'category' => 'DevOps', 'url_light' => 'iconskills/Docker.svg',          'url_dark' => null],
            ['name' => 'AWS',        'category' => 'DevOps', 'url_light' => 'iconskills/AWS-Light.svg',       'url_dark' => 'iconskills/AWS-Dark.svg'],
            ['name' => 'Azure',      'category' => 'DevOps', 'url_light' => 'iconskills/Azure-Light.svg',     'url_dark' => 'iconskills/Azure-Dark.svg'],
            ['name' => 'Kubernetes', 'category' => 'DevOps', 'url_light' => 'iconskills/Kubernetes.svg',      'url_dark' => null],
            ['name' => 'Vercel',     'category' => 'DevOps', 'url_light' => 'iconskills/Vercel-Light.svg',    'url_dark' => 'iconskills/Vercel-Dark.svg'],
        ];

        foreach ($skills as $skill) {
            TechnicalSkill::updateOrCreate(
                ['name' => $skill['name']],
                [
                    'category' => $skill['category'],
                    'url_light' => $skill['url_light'],
                    'url_dark' => $skill['url_dark'],
                ]
            );
        }

        $this->command->info('Skills insertados correctamente sin duplicados.');
    }
}
