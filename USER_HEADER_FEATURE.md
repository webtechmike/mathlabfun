# User Header Feature

## Overview

When a user is logged in, the icon in the top right of the screen now displays additional information alongside the astronaut icon:

1. **SuperStreak Score**: Shows the user's current SuperStreak count with a fire emoji
2. **Reward Status**: Indicates whether the user is earning regular rewards or double rewards in spacebucks

## Implementation Details

### Visual Design

-   **Background**: Gradient background with glassmorphism effect
-   **Animation**: Subtle glow animation to draw attention
-   **Layout**: Horizontal layout with user info on the left and astronaut icon on the right

### Reward Logic

-   **Regular Rewards**: Displayed when `dailyStreak < 3` (⭐ icon)
-   **Double Rewards**: Displayed when `dailyStreak >= 3` (🚀 icon)

### Components Modified

1. **App.tsx**: Added `renderUserHeader()` function to conditionally render user information
2. **App.scss**: Added comprehensive styling for the new user header component

### Features

-   **Responsive Design**: Adapts to different screen sizes
-   **Conditional Rendering**: Only shows for logged-in users
-   **Visual Feedback**: Different icons and colors based on reward status
-   **Accessibility**: Proper contrast and readable text

## Technical Implementation

### State Management

-   Uses Redux store to access `currentUser` data
-   Displays `superStreak` and `dailyStreak` values
-   Determines reward status based on streak thresholds

### Styling

-   Uses SCSS for maintainable styles
-   Implements glassmorphism design pattern
-   Includes smooth animations and transitions
-   Responsive design with proper spacing

### User Experience

-   Clear visual hierarchy
-   Intuitive iconography
-   Consistent with existing design language
-   Non-intrusive but informative

## Future Enhancements

-   Add tooltips for more detailed information
-   Include additional user stats (total correct answers, etc.)
-   Implement click interactions for detailed user profile
-   Add sound effects for reward status changes
