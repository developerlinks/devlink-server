import { request } from '@devlink/cli-utils';

export function fetchMaterials() {
  return request({
    url: '/material',
  });
}
