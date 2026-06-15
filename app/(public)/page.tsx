// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p>
          Welcome to Pocket Heist — the app where you assign sneaky little
          missions to your coworkers and watch the chaos unfold. Steal someone's
          stapler, rearrange the break room, or challenge a colleague to go an
          entire day without saying "synergy." The stakes are low. The glory is
          real.
        </p>
        <p>
          Every heist comes with a deadline, a difficulty rating, and the sweet
          satisfaction of watching your target realise what just happened.
          Complete missions to climb the leaderboard, earn badges, and cement
          your legacy as the most diabolical desk jockey in the office.
        </p>
        <p>
          Ready to cause some (harmless) chaos? Log in to see your active
          heists, or sign up to start your first mission today.
        </p>
      </div>
    </div>
  )
}
