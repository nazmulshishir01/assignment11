const SectionTitle = ({ title, subtitle, center = true }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <h2 className="heading-primary mb-4">{title}</h2>
      {subtitle && (
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
