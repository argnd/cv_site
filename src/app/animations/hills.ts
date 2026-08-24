import { HillCat } from '../models/scene.models';

/**
 * The two cats sitting on the near hill, right of the text column — or centred
 * on the fold once the gutter is gone, see `styles/hills.css`. Changing the
 * insets or heights below moves the pair's centre, which `--cat-cluster-mid`
 * mirrors: it is `right` of the rightmost cat plus half the span the two cover.
 */
export const HILL_CATS: readonly HillCat[] = [
  { name: 'vivi', tabby: false, height: 56, right: 118 },
  { name: 'jojo', tabby: true, height: 68, right: 40 },
];
