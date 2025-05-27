import React from "react";
import "./Guideline.css";

const dos = [
  {
    text: "Drop, cover, and hold on during shaking.",
    details:
      "Get down on your hands and knees, cover your head and neck under sturdy furniture if available, and hold on until shaking stops.",
  },
  {
    text: "Stay indoors until the shaking stops and it’s safe to go outside.",
    details:
      "Avoid exiting buildings during the earthquake to prevent injuries from falling debris.",
  },
  {
    text: "Take cover under sturdy furniture if available.",
    details: "Use tables or desks for protection from falling objects.",
  },
  {
    text: "Protect your head and neck with your arms if nothing is nearby.",
    details:
      "If you can't get under furniture, crouch and shield your head and neck with your arms.",
  },
  {
    text: "Stay away from windows, mirrors, and glass.",
    details: "Glass can shatter and cause serious injuries during shaking.",
  },
  {
    text: "If outside, move to an open area away from buildings and power lines.",
    details:
      "Avoid tall structures, trees, streetlights, and utility wires that may fall.",
  },
  {
    text: "Have an emergency kit ready with food, water, and first aid.",
    details:
      "Prepare in advance to meet basic needs during or after an earthquake.",
  },
  {
    text: "Check for injuries and help others once the shaking stops.",
    details: "Provide assistance if you are able and safe to do so.",
  },
  {
    text: "Follow local alerts and instructions from emergency services.",
    details:
      "Stay informed via radio, TV, or official apps for updates and instructions.",
  },
];

const donts = [
  {
    text: "Don’t run outside during the shaking.",
    details: "Running increases your risk of injury from falling debris.",
  },
  {
    text: "Don’t use elevators.",
    details: "Elevators may malfunction or become stuck during an earthquake.",
  },
  {
    text: "Don’t stand near windows or under heavy objects.",
    details: "Glass and heavy items can fall and cause injuries.",
  },
  {
    text: "Don’t panic — stay as calm and alert as possible.",
    details: "Staying calm helps you think clearly and react safely.",
  },
  {
    text: "Don’t light matches or use open flames after an earthquake (gas leaks!).",
    details: "There may be gas leaks which can ignite and cause explosions.",
  },
  {
    text: "Don’t use the phone unless it's an emergency.",
    details: "Keep phone lines open for emergency communication.",
  },
  {
    text: "Don’t drive unless it’s necessary — roads may be damaged.",
    details: "Avoid accidents and allow emergency vehicles to move freely.",
  },
  {
    text: "Don’t spread misinformation — rely on official sources.",
    details: "False information can cause unnecessary panic and confusion.",
  },
];

const Guideline = () => {
  return (
    <section className="guideline-section">
      <h2 className="guideline-title">Earthquake Safety Guidelines</h2>

      <div className="guideline-video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/dJpIU1rSOFY"
          title="Earthquake Safety Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="guideline-grid">
        <article className="guideline-article guideline-dos">
          <header className="guideline-header">
            <h3 className="text-green-800">What You Should Do</h3>
          </header>
          <ul className="guideline-list">
            {dos.map(({ text, details }, index) => (
              <li key={index} className="guideline-list-item">
                <p className="guideline-text text-green-900">{text}</p>
                <p className="guideline-detail text-green-700">{details}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="guideline-article guideline-donts">
          <header className="guideline-header">
            <h3 className="text-red-800">What to Avoid</h3>
          </header>
          <ul className="guideline-list">
            {donts.map(({ text, details }, index) => (
              <li key={index} className="guideline-list-item">
                <p className="guideline-text text-red-900">{text}</p>
                <p className="guideline-detail text-red-700">{details}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default Guideline;
