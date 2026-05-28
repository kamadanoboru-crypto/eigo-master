type StudyPaginationProps = {
  page: number;
  totalPages: number;
  startNo: number;
  endNo: number;
  onPrev: () => void;
  onNext: () => void;
};

export function StudyPagination({
  page,
  totalPages,
  startNo,
  endNo,
  onPrev,
  onNext,
}: StudyPaginationProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      background: 'var(--bg)',
      border: '1px solid var(--bd)',
      borderRadius: 8,
      padding: '10px 12px',
    }}>
      <button className="bg" style={{ fontSize: 12, padding: '7px 10px' }} disabled={page <= 0} onClick={onPrev}>
        戻る
      </button>
      <div className="jp" style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)', textAlign: 'center' }}>
        {page + 1} / {totalPages} ページ<br />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)' }}>No.{startNo}〜No.{endNo}</span>
      </div>
      <button className="bg" style={{ fontSize: 12, padding: '7px 10px' }} disabled={page >= totalPages - 1} onClick={onNext}>
        次へ
      </button>
    </div>
  );
}
