import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import "../../styles/pagination.css"

export default function Pagination({ page, pages, onPageChange }) {
    if (!pages || pages <= 1) return null;

    const getPages = () => {
        const arr = [];
        const delta = 2;
        const left = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);
        arr.push(1);
        if (left > 2) arr.push('...');
        for (let i = left; i <= right; i++) arr.push(i);
        if (right < pages - 1) arr.push('...');
        if (pages > 1) arr.push(pages);
        return arr;
    };

    return (
        <div className="pagination">
            <button
                className="page-btn page-btn-arrow"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                <RiArrowLeftSLine size={18} />
            </button>

            {getPages().map((p, i) =>
                p === '...'
                    ? <span key={`dots-${i}`} className="page-dots">…</span>
                    : <button
                        key={p}
                        className={`page-btn${p === page ? ' active' : ''}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
            )}

            <button
                className="page-btn page-btn-arrow"
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
            >
                <RiArrowRightSLine size={18} />
            </button>
        </div>
    );
}