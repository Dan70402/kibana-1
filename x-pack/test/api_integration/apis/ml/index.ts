/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { FtrProviderContext } from '../../ftr_provider_context';

export default function({ getService, loadTestFile }: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const ml = getService('ml');

  describe('Machine Learning', function() {
    this.tags(['mlqa']);

    before(async () => {
      await ml.securityCommon.createMlRoles();
      await ml.securityCommon.createMlUsers();
    });

    after(async () => {
      await ml.securityCommon.cleanMlUsers();
      await ml.securityCommon.cleanMlRoles();

      await ml.testResources.deleteIndexPattern('kibana_sample_data_logs');

      await esArchiver.unload('ml/ecommerce');
      await esArchiver.unload('ml/categorization');
      await esArchiver.unload('ml/sample_logs');

      await ml.testResources.resetKibanaTimeZone();
    });

    loadTestFile(require.resolve('./bucket_span_estimator'));
    loadTestFile(require.resolve('./calculate_model_memory_limit'));
    loadTestFile(require.resolve('./categorization_field_examples'));
    loadTestFile(require.resolve('./get_module'));
    loadTestFile(require.resolve('./recognize_module'));
    loadTestFile(require.resolve('./setup_module'));
  });
}
