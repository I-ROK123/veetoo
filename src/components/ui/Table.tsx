import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table
        className={clsx(
          'min-w-full divide-y divide-neutral-200 dark:divide-neutral-700',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return (
    <thead
      className={clsx(
        'bg-neutral-50 dark:bg-neutral-800',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return (
    <tbody
      className={clsx(
        'divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr
      className={clsx(
        'hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td
      className={clsx(
        'px-6 py-4 whitespace-nowrap text-sm text-neutral-800 dark:text-neutral-300',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableFooter: React.FC<TableFooterProps> = ({ children, className, ...props }) => {
  return (
    <tfoot
      className={clsx(
        'bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter
};