<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Client Registration: Visuals</title>
<!-- Google Fonts & Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee2b8c",
                        "background-light": "#f8f6f7",
                        "background-dark": "#221019",
                    },
                    fontFamily: {
                        "display": ["Plus Jakarta Sans", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        body {
            font-family: "Plus Jakarta Sans", sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark text-[#181114] dark:text-white min-h-screen flex flex-col">
<!-- Top Navigation Bar -->
<div class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
<button class="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
<span class="material-symbols-outlined text-[#181114] dark:text-white">arrow_back_ios_new</span>
</button>
<h2 class="text-lg font-bold leading-tight tracking-tight">Client Registration</h2>
<div class="size-10"></div> <!-- Spacer for symmetry -->
</div>
<!-- Progress Indicator -->
<div class="px-6 py-4 flex flex-col gap-3">
<div class="flex justify-between items-end">
<p class="text-sm font-semibold text-primary uppercase tracking-wider">Step 3: Visual Identity</p>
<p class="text-sm font-medium opacity-60">3 of 3</p>
</div>
<div class="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
<div class="h-full bg-primary rounded-full transition-all duration-500" style="width: 100%;"></div>
</div>
</div>
<!-- Main Content -->
<main class="flex-1 px-6 pb-24">
<div class="text-center mt-4 mb-8">
<h1 class="text-3xl font-extrabold tracking-tight mb-2">Personalize Your Profile</h1>
<p class="text-base opacity-70">Add photos to make your event dashboard feel like home.</p>
</div>
<!-- Upload Section -->
<div class="relative mb-12">
<!-- Cover Photo Card -->
<div class="w-full h-48 rounded-xl bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-all hover:border-primary/50" data-alt="Placeholder for a wide cinematic cover photo of a wedding venue">
<div class="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
<span class="material-symbols-outlined text-4xl">add_a_photo</span>
<p class="text-xs font-medium uppercase tracking-tighter">Add Cover Photo</p>
<p class="text-[10px] opacity-60">Recommended: 16:9 ratio</p>
</div>
<!-- Action Badge for Cover Photo -->
<div class="absolute bottom-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
<span class="material-symbols-outlined text-primary text-sm">edit</span>
</div>
</div>
<!-- Profile Photo (Overlapping) -->
<div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
<div class="relative">
<div class="size-32 rounded-full bg-background-light dark:bg-background-dark p-1 shadow-xl">
<div class="size-full rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors" data-alt="Circular placeholder for user profile headshot photo">
<span class="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500">person</span>
<p class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1">Photo</p>
</div>
</div>
<!-- Profile Edit Badge -->
<div class="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-background-dark">
<span class="material-symbols-outlined text-base">add</span>
</div>
</div>
</div>
</div>
<!-- Form Context / Instructions -->
<div class="mt-20 space-y-6">
<div class="p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex items-start gap-4">
<div class="bg-primary/10 p-3 rounded-lg text-primary">
<span class="material-symbols-outlined">visibility</span>
</div>
<div>
<h3 class="font-bold text-base mb-1">Visual Identity Matters</h3>
<p class="text-sm opacity-60 leading-relaxed">Your profile and cover photos will be visible to your event planner and vendors on the shared dashboard.</p>
</div>
</div>
</div>
<div class="flex items-center gap-2 px-2">
<input class="rounded text-primary focus:ring-primary size-5 border-gray-300 dark:border-gray-700 dark:bg-gray-800" id="terms" type="checkbox"/>
<label class="text-xs opacity-70 leading-tight" for="terms">I agree to the Terms of Service and Privacy Policy regarding media usage.</label>
</div>
</div>
</main>
<!-- Bottom Action Bar (iOS Style) -->
<footer class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark">
<button class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-[0_8px_30px_rgb(238,43,140,0.3)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Finish &amp; Create Dashboard
            <span class="material-symbols-outlined">arrow_forward</span>
</button>
<!-- iOS Home Indicator Space -->
<div class="h-4"></div>
</footer>
</body></html>