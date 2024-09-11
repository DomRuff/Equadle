# Equadle

An educational recreation of the [Nerdle](https://nerdlegame.com/) game using Angular featuring modern styling using SCSS. Try to guess the equation by inputting numbers and operations. This game combines fun with learning, helping users improve both their arithmetic and logic skills.

## Features

- **Interactive Equation Guessing**: Players guess mathematical equations, similar to word games like Wordle, but using numbers and mathematical operators.
- **Color Feedback**: Provides visual feedback based on the correctness of the guessed equation:
  - Green for correct digits/operators in the right position
  - Yellow for correct digits/operators in the wrong position
  - Gray for incorrect digits/operators
- **Game Reset Button**: On either a win or loss, you may restart the game and try again on a new equation!

## Technologies Used

- **Angular**: Frontend framework used for structuring the game's logic and components
- **SCSS**: Preprocessor for CSS, used to manage stylesheets efficiently with variables, mixins, and nested rules.
- **TypeScript**: Type-safe JavaScript for better development experience and error handling
- **HTML5**: Markup language for structuring the interface

## Installation

1. **Clone the Repository**:
   ```bash
    git clone https://github.com/DomRuff/Equadle.git
    cd Equadle
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Application**:
   ```bash
   ng serve
   ```

From here you can access the game on the default port `http:/localhost:4200/`.
