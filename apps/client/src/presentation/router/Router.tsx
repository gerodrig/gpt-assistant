import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  AssistantPage,
  AudioToTextPage,
  ImageGenerationPage,
  ImageTuningPage,
  OrthographyPage,
  ProsConsPage,
  ProsConsStreamPage,
  TextToAudioPage,
  TranslatePage,
} from '../pages';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const menuRoutes = [
{
    to: '/orthography',
    icon: 'fa-solid fa-spell-check',
    title: 'Spelling',
    description: 'Correct spelling',
    component: <OrthographyPage />,
},
{
    to: '/pros-cons',
    icon: 'fa-solid fa-code-compare',
    title: 'Pros & Cons',
    description: 'Compare pros and cons',
    component: <ProsConsPage />,
},
{
    to: '/pros-cons-stream',
    icon: 'fa-solid fa-water',
    title: 'As a Stream',
    description: 'With message stream',
    component: <ProsConsStreamPage />,
},
{
    to: '/translate',
    icon: 'fa-solid fa-language',
    title: 'Translate',
    description: 'Translate texts to other languages',
    component: <TranslatePage />,
},
{
    to: '/text-to-audio',
    icon: 'fa-solid fa-podcast',
    title: 'Text to Audio',
    description: 'Convert text to audio',
    component: <TextToAudioPage />,
},
{
    to: '/image-generation',
    icon: 'fa-solid fa-image',
    title: 'Images',
    description: 'Generate images',
    component: <ImageGenerationPage />,
},
{
    to: '/image-tuning',
    icon: 'fa-solid fa-wand-magic',
    title: 'Edit Image',
    description: 'Continuous generation',
    component: <ImageTuningPage />,
},
{
    to: '/audio-to-text',
    icon: 'fa-solid fa-comment-dots',
    title: 'Audio to Text',
    description: 'Convert audio to text',
    component: <AudioToTextPage />,
},
{
    to: '/assistant',
    icon: 'fa-solid fa-user',
    title: 'Assistant',
    description: 'Assistant information',
    component: <AssistantPage />,
},
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      ...menuRoutes.map(({ to, component }) => ({
        path: to,
        element: component,
      })),
      {
        path: '',
        element: <Navigate to={menuRoutes[0].to} />,
      },
    ],
  },
]);
