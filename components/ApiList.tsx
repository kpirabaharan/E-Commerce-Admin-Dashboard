'use client';

import { useParams } from 'next/navigation';

import { useOrigin } from '@/hooks/useOrigin';
import { ApiAlert } from '@/components/ApiAlert';

interface ApiListProps {
  entityName: string;
  enttityIdName: string;
}

export const ApiList = ({ entityName, enttityIdName }: ApiListProps) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title='GET'
        variant={'public'}
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title='GET'
        variant={'public'}
        description={`${baseUrl}/${entityName}/{${enttityIdName}}`}
      />
      <ApiAlert
        title='POST'
        variant={'admin'}
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title='PATCH'
        variant={'admin'}
        description={`${baseUrl}/${entityName}/{${enttityIdName}}`}
      />
      <ApiAlert
        title='DELETE'
        variant={'admin'}
        description={`${baseUrl}/${entityName}/{${enttityIdName}}`}
      />
    </>
  );
};
