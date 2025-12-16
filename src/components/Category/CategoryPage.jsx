import React from 'react'
import '../../styles/home.css'

export default function CategoryPage() {
    const categories = [
        { title: "Propulsion", icon: "🔥", desc: "Engines and boosters." },
        { title: "Navigation", icon: "🧭", desc: "Guidance systems." },
        { title: "Life Support", icon: "🌱", desc: "Oxygen and sustainability." },
        { title: "Communications", icon: "📡", desc: "Long-range signals." },
        { title: "Materials", icon: "💎", desc: "Heat shields and hulls." },
        { title: "Research", icon: "🔬", desc: "Scientific experiments." },
    ]

    return (
        <div className="category-page">
            <section className="hero small-hero">
                <div className="hero-inner">
                    <h2>Mission Categories</h2>
                    <p>Explore our wide range of departmental resources.</p>
                </div>
            </section>

            <section className="cards">
                {categories.map((cat, i) => (
                    <article className="card" key={i}>
                        <div className="card-icon">{cat.icon}</div>
                        <h3>{cat.title}</h3>
                        <p>{cat.desc}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}
