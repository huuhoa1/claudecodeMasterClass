import styles from "./Avatar.module.css"

function getInitials(name: string): string {
  const startsWithUpper = /^[A-Z]/.test(name)
  const hasMoreUppers = /[A-Z]/.test(name.slice(1))

  if (startsWithUpper && hasMoreUppers) {
    return (name.match(/[A-Z]/g) ?? []).slice(0, 2).join("")
  }

  return name[0] ?? ""
}

export default function Avatar({ name }: { name: string }) {
  return (
    <div className={styles.avatar}>
      {getInitials(name)}
    </div>
  )
}
