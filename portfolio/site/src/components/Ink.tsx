import { Fragment, type ElementType } from 'react';

interface InkProps {
  as?: ElementType;
  className?: string;
  /** Plain text; "\n" becomes a line break. */
  children: string;
}

/**
 * Text drawn by the motion shader (dissolve, trails, pointer interference).
 * The DOM copy stays for layout, selection and accessibility; it turns transparent
 * while WebGL renders it.
 */
export function Ink({ as: Tag = 'p', className, children }: InkProps) {
  const lines = children.split('\n');
  return (
    <Tag className={className} data-ink="">
      {lines.map((line, i) => (
        <Fragment key={i}>
          {/* The space keeps words apart when narrow screens hide the manual break. */}
          {i > 0 && (
            <>
              <br />{' '}
            </>
          )}
          {line}
        </Fragment>
      ))}
    </Tag>
  );
}
