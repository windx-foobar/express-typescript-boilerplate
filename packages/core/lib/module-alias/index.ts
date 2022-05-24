import moduleAlias from 'module-alias';

export default (initialAliases, prodReplacer) => {
  const transformedAliases = {};

  for (const name of Object.keys(initialAliases)) {
    transformedAliases[name] = prodReplacer(initialAliases[name]);
  }

  moduleAlias.addAliases(transformedAliases);
};
