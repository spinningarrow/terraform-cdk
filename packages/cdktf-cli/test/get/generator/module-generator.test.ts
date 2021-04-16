import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ConstructsMaker, Language } from '../../../lib/get/constructs-maker'
import { TerraformModuleConstraint  } from '../../../lib/config'
import { expectModuleToMatchSnapshot } from '../util';

test('generate some modules', async () => {
  jest.setTimeout(60000)

  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'module-generator.test'));
  const constraint = new TerraformModuleConstraint('terraform-aws-modules/eks/aws@7.0.1')

  const maker = new ConstructsMaker({codeMakerOutput: workdir, targetLanguage: Language.TYPESCRIPT}, [constraint])
  await maker.generate()

  const output = fs.readFileSync(path.join(workdir, 'modules/terraform-aws-modules/eks/aws.ts'), 'utf-8');
  expect(output).toMatchSnapshot();
});

expectModuleToMatchSnapshot('no module outputs', 'generator', ['module-no-outputs.test.fixture.tf']);

expectModuleToMatchSnapshot('typeless variables', 'generator', ['module-no-variable-type.test.fixture.tf']);

expectModuleToMatchSnapshot('no newline', 'generator', ['module-no-newline-1.test.fixture.tf', 'module-no-newline-2.test.fixture.tf']);