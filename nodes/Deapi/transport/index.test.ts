import type { IExecuteFunctions } from 'n8n-workflow';
import { mockDeep } from 'jest-mock-extended';
import { apiRequest} from './index';

describe('deAPI transport', () => {
  const executeFunctionsMock = mockDeep<IExecuteFunctions>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call httpRequestWithAuthentication with correct parameters', async () => {

    await apiRequest.call(executeFunctionsMock, 'GET', '/models', {
			qs: {
				per_page: 15,
        page: 1,
			},
		});

    expect(executeFunctionsMock.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
      'deApi',
      {
        method: 'GET',
        url: 'https://api.deapi.ai/api/v1/client/models',
        json: true,
        qs: {
          per_page: 15,
          page: 1,
        },
      },
    );
  });

  it('should override the values with `option`', async () => {

    await apiRequest.call(executeFunctionsMock, 'GET', '', {
      option: {
        url: 'https://dupa.pl',
        returnFullResponse: true,
      },
    });

    expect(executeFunctionsMock.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
      'deApi',
      {
        method: 'GET',
        url: 'https://dupa.pl',
        json: true,
        returnFullResponse: true,
      },
    );
  });
});