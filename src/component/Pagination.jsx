function Pagination({pagination, onChangePage}) {
    const hanndlePageClick = (e, page) => {
        e.preventDefault();
        onChangePage(page);
    }

  return (
      <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li 
            className="page-item"
            onClick={ e=> {hanndlePageClick(e, pagination.current_page -1 )} }
        >
          <a className={`page-link ${ !pagination.has_pre && 'disabled' }`} href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
            Array.from({length:pagination.total_pages}, ( _, index)=>
                <li className={`page-item ${ pagination.current_page === index+1 && 'active'}`} key={index} onClick={ e=> {hanndlePageClick(e, index+1)} }>
                    <a className="page-link" href="#">
                        {index+1}
                    </a>
                </li>
            )
        }
        <li 
            className="page-item"
            onClick={ e=> {hanndlePageClick(e, pagination.current_page +1 )} }
        >
          <a className={`page-link ${ !pagination.has_pre && 'disabled' }`} href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
