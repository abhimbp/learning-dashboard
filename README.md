# Next-Gen Learning Dashboard

A high-fidelity, futuristic student learning dashboard built with Next.js 14, Tailwind CSS, Framer Motion, and Supabase.

## 🚀 Architectural Choices

This project was built using the **Next.js App Router** to leverage the latest React features. The core architecture relies on a **Bento Grid** layout system, ensuring a responsive, modular, and highly visual data presentation structure. 

### Server / Client Component Split
A key architectural decision was strictly dividing Server Components and Client Components to maximize performance and security:
- **Server Components (Default):** Pages like `src/app/page.tsx` and `src/app/courses/page.tsx` are React Server Components. They securely fetch data directly from Supabase on the server using `@supabase/ssr`. This eliminates loading spinners for initial data, prevents exposing database logic to the client, and vastly improves SEO and initial load speeds.
- **Client Components (`"use client"`):** Interactive UI elements like `Sidebar.tsx`, the animated `CourseTile.tsx`, and the `Analytics` charts are strictly Client Components. They utilize `useState` and `framer-motion` to provide buttery-smooth animations and instant interactive feedback without triggering server round-trips.

### Styling & Animation
- **Tailwind CSS:** Used for all styling, utilizing a custom cyberpunk-inspired color palette (deep obsidians, vibrant purples, and electric blues).
- **Framer Motion:** Employed heavily for micro-interactions, spring physics on hover states, and seamless `layoutId` transitions in the Sidebar navigation.

## 🛠️ Setup Instructions

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `.env.example` to `.env.local`.
4. Add your Supabase Project URL and Anon Key to the `.env.local` file.
5. Run the development server with `npm run dev`.

## 🚧 Challenges Faced
One of the primary challenges was ensuring fluid animations (like the glowing borders and sidebar active states) didn't conflict with Next.js Server Side Rendering (SSR). This was resolved by carefully isolating animation logic into dedicated Client Components while keeping the heavy lifting of data fetching cleanly abstracted in Server Components. Additionally, handling responsive layout shifts (from a side-nav on Desktop to a bottom-nav on Mobile) required precise Tailwind breakpoint management.
