import { useState, useEffect } from 'react';
import SingleApplication from './SingleApplication';
import ErrorMessage from './ErrorMessage';
import { getApiEndpoint } from './config/env';
import styles from './Applications.module.css';

interface Application {
  guid: string;
  loan_amount: number;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  date_created: string;
  expiry_date: string;
}

interface PaginationInfo {
  hasMore: boolean;
  nextPage: number;
}

const STARTING_PAGE = 1;

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newlyLoadedCount, setNewlyLoadedCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    hasMore: true,
    nextPage: 1,
  });

  const fetchApplications = async (page: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${getApiEndpoint()}?_page=${page}&_limit=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data: Application[] = await response.json();

      // Parse Link header for pagination metadata
      const linkHeader = response.headers.get('Link');
      const hasNextPage = linkHeader
        ? linkHeader.includes('rel="next"')
        : false;

      setApplications((prev) => {
        if (append) {
          setNewlyLoadedCount(data.length);
          // Reset newly loaded count after animation completes
          setTimeout(() => setNewlyLoadedCount(0), 1000);
          return [...prev, ...data];
        } else {
          setNewlyLoadedCount(0);
          return data;
        }
      });
      setPagination({
        hasMore: hasNextPage,
        nextPage: page + 1,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load applications. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchApplications(pagination.nextPage, true);
    }
  };

  const handleRetry = () => {
    setError(null);
    setApplications([]);
    setPagination({
      hasMore: true,
      nextPage: 1,
    });
    fetchApplications(STARTING_PAGE);
  };

  useEffect(() => {
    fetchApplications(STARTING_PAGE);
  }, []);

  return (
    <div className={styles.Applications}>
      {error ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : (
        <>
          <div className={styles.applicationsList}>
            {applications.map((application, index) => {
              const isNewlyLoaded =
                newlyLoadedCount > 0 &&
                index >= applications.length - newlyLoadedCount;

              return (
                <SingleApplication
                  key={application.guid}
                  application={application}
                  animationDelay={
                    isNewlyLoaded
                      ? (index - (applications.length - newlyLoadedCount)) * 0.1
                      : 0
                  }
                  isNewlyLoaded={isNewlyLoaded}
                />
              );
            })}
          </div>
          {pagination.hasMore && !loading && (
            <button
              onClick={loadMore}
              disabled={loading}
              className={styles.loadMoreButton}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
          {loading && applications.length === 0 && (
            <div className={styles.initialLoading}>Loading applications...</div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
