import { Lesson, User } from './types';

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Prof. Gauss',
  email: 'gauss@mathmentor.edu',
  role: 'teacher',
};

export const MOCK_STUDENT: User = {
  id: 's1',
  name: 'Ada Lovelace',
  email: 'ada@student.com',
  role: 'student',
};

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Introduction to Derivatives',
    topic: 'Calculus',
    authorId: 't1',
    createdAt: '2024-03-20',
    content: `
      <h2>The Concept of a Derivative</h2>
      <p>At its core, a derivative represents the <strong>instantaneous rate of change</strong> of a function with respect to one of its variables.</p>
      <p>Imagine you're driving a car. Your speedometer shows your instantaneous velocity. In mathematical terms, this is the derivative of your position function with respect to time.</p>
      <h2>The Formal Definition</h2>
      <p>The derivative of a function f(x) at a point x is defined as the limit:</p>
      <code>f'(x) = lim(h -> 0) [f(x + h) - f(x)] / h</code>
      <h2>Common Rules</h2>
      <ul>
        <li><strong>Power Rule:</strong> d/dx [x^n] = nx^(n-1)</li>
        <li><strong>Constant Rule:</strong> d/dx [c] = 0</li>
        <li><strong>Sum Rule:</strong> (f + g)' = f' + g'</li>
      </ul>
    `,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'What is the derivative of f(x) = x^2?',
        options: ['x', '2x', 'x^2', '2'],
        correctAnswer: '2x',
        explanation: 'Using the power rule: d/dx [x^n] = nx^(n-1). Here n=2, so 2x^(2-1) = 2x.'
      },
      {
        id: 'q2',
        type: 'fill-in-the-blank',
        prompt: 'The derivative of a constant function f(x) = 5 is...',
        correctAnswer: '0',
        explanation: 'A constant function does not change, so its rate of change (derivative) is always zero.'
      }
    ]
  },
  {
    id: 'l2',
    title: 'Pythagorean Theorem Deep Dive',
    topic: 'Geometry',
    authorId: 't1',
    createdAt: '2024-03-21',
    content: `
      <h2>The Theorem</h2>
      <p>In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.</p>
      <p>Formula: <code>a² + b² = c²</code></p>
      <p>Where 'c' is the longest side (the hypotenuse).</p>
    `,
    questions: [
      {
        id: 'q3',
        type: 'multiple-choice',
        prompt: 'If a=3 and b=4, what is c?',
        options: ['5', '7', '25', '12'],
        correctAnswer: '5',
        explanation: '3² + 4² = 9 + 16 = 25. The square root of 25 is 5.'
      }
    ]
  }
];