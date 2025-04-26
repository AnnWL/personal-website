# Personal Website — Ann Wei Ling

## App Name and Description

This is a React-based portfolio site where I share reflections, book reviews, and my career journey. I wanted a lightweight platform where I could document my learning journey, favorite reads, and thoughts — while also practicing front-end skills such as React, responsive design, and simple API integrations.

## Features

- **Homepage**: Quick overview of different sections.
- **About Me**: Personal background and sabbatical journey.
- **Book Reviews**: Reflections on books I've read, in a casual note-to-self style.
- **Work Journey**: A personal career timeline across different fields.
- **Personal Reflections**: Thoughts and learning moments captured along the way.

## Tech Stack

- **Frontend**:

  - React (Vite setup)
  - React Router
  - Framer Motion (for simple page animations)

- **Styling**:

  - Custom CSS
  - Variables set in `:root` for colors, fonts, and layout consistency

- **Other tools**:
  - Airtable API (for managing book review content)

## Getting Started

To run this project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AnnWL/personal-website.git
   cd personal-website
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

The app will start on `http://localhost:5173/` (or the next available port).

## Environment Variables

You will need an `.env` file with the following variables if you are using Airtable for Book Reviews:

```plaintext
VITE_AIRTABLE_BASE_ID=your_airtable_base_id
VITE_AIRTABLE_TABLE_NAME=your_table_name
VITE_AIRTABLE_TOKEN=your_airtable_api_key
```

These are used to fetch book review data dynamically.

## Attributions

This section to be updated.

## Future Enhancements (Ideas)

- Add a mobile-responsive navigation menu (e.g., hamburger menu on small screens)

- Animate page transitions more richly using Framer Motion

- Add more projects under Work Journey

- Build a small blog or journal section for new reflections

## License

This project is licensed for personal use and learning.
Feel free to fork for your own practice or portfolio building — but please credit if you adapt major portions.
