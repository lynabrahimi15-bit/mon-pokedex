export default function Button({ variant = 'primary', size, className = '', ...props }) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean)
  return <button type="button" className={classes.join(' ')} {...props} />
}
