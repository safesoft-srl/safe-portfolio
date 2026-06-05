<?php

namespace Database\Seeders;

use App\Models\SoftSkill;
use Illuminate\Database\Seeder;

class SoftSkillSeeder extends Seeder
{
    public function run(): void
    {

        $skills = [
            'Comunicación',
            'Trabajo en equipo',
            'Liderazgo',
            'Adaptabilidad',
            'Pensamiento crítico',
            'Resolución de problemas',
            'Creatividad',
            'Gestión del tiempo',
            'Empatía',
            'Proactividad',

            'Escucha activa',
            'Negociación',
            'Presentación efectiva',
            'Comunicación asertiva',

            'Colaboración',
            'Cooperación interdisciplinaria',
            'Resolución de conflictos',
            'Coordinación de equipos',

            'Toma de decisiones',
            'Gestión de equipos',
            'Liderazgo situacional',
            'Mentoría',
            'Delegación efectiva',

            'Pensamiento analítico',
            'Pensamiento estratégico',
            'Toma de decisiones bajo presión',
            'Análisis de información',

            'Organización',
            'Planificación',
            'Gestión de prioridades',
            'Productividad personal',
            'Cumplimiento de objetivos',

            'Flexibilidad',
            'Aprendizaje rápido',
            'Resiliencia',
            'Manejo del cambio',

            'Innovación',
            'Pensamiento creativo',
            'Resolución creativa de problemas',
            'Diseño de soluciones',

            'Inteligencia emocional',
            'Autoconciencia',
            'Autocontrol',
            'Motivación interna',
            'Manejo del estrés',

            'Responsabilidad',
            'Disciplina',
            'Compromiso',
            'Ética profesional',
            'Puntualidad',

            'Atención al detalle',
            'Pensamiento lógico',
            'Capacidad de análisis',
            'Orientación a resultados',
            'Orientación al cliente',
        ];
        foreach ($skills as $skill) {
            SoftSkill::firstOrCreate(
                ['name' => $skill]
            );
        }
    }
}
