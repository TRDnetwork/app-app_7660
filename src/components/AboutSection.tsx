export default function AboutSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-text mb-6 font-display slide-up">
          About Me
        </h2>
        <p className="text-lg text-text-dim leading-relaxed slide-up" style={{ animationDelay: '0.1s' }}>
          I'm a developer passionate about building elegant, user-centered digital experiences. With
          a background in computer science and design, I bridge the gap between functionality and
          aesthetics. I believe in clean code, thoughtful UX, and the power of simplicity.
        </p>
      </div>
    </div>
  );
}
---