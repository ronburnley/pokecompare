import React from 'react';
import styled from 'styled-components';
import { Button, Flex } from '../styles/StyledComponents';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0;
`;

const PageButton = styled(Button)<{ active?: boolean }>`
  margin: 0 4px;
  padding: 8px 14px;
  background-color: ${props => props.active ? '#ff5350' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.active ? '#ff5350' : '#e0e0e0'};
    transform: translateY(-2px);
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show current page and 1 page before and after current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates and sort
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <PaginationContainer>
      <Flex gap="8px">
        <PageButton
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </PageButton>
        
        {pageNumbers.map((page, index) => {
          // Add ellipsis
          if (index > 0 && page > pageNumbers[index - 1] + 1) {
            return (
              <React.Fragment key={`ellipsis-${page}`}>
                <span style={{ margin: '0 4px' }}>...</span>
                <PageButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PageButton>
              </React.Fragment>
            );
          }
          
          return (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          );
        })}
        
        <PageButton
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </Flex>
    </PaginationContainer>
  );
};

export default Pagination;