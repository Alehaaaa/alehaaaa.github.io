import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const src = join(root, 'src')
const publicDir = join(root, 'public')

const projectDirs = readdirSync(join(src, 'projects'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const importModule = (path) => import(pathToFileURL(path).href)
const publicAssetPath = (assetPath) => join(publicDir, assetPath.replace(/^\/+/, ''))

test('profile public links point at available or valid resources', async () => {
  const { PROFILE } = await importModule(join(src, 'data/profile.js'))

  assert.ok(PROFILE.name)
  assert.ok(PROFILE.links.linkedin.startsWith('https://'))
  assert.ok(PROFILE.links.imdb.startsWith('https://'))
  assert.ok(existsSync(publicAssetPath(PROFILE.links.cv)), `Missing CV asset: ${PROFILE.links.cv}`)
})

test('project data references existing public assets', async () => {
  for (const dir of projectDirs) {
    const dataPath = join(src, 'projects', dir, 'data.js')
    const { default: project } = await importModule(dataPath)

    assert.ok(project.title, `${dir} is missing a title`)
    assert.ok(project.poster, `${dir} is missing a poster`)
    assert.ok(existsSync(publicAssetPath(project.poster)), `${dir} poster does not exist: ${project.poster}`)

    for (const company of project.companies || []) {
      assert.ok(company.name, `${dir} has a company without a name`)
      assert.ok(company.url?.startsWith('https://'), `${dir} company URL should be https: ${company.url}`)
      assert.ok(existsSync(publicAssetPath(company.logo)), `${dir} logo does not exist: ${company.logo}`)
    }
  }
})

test('MDX blog content stays inside the supported safe subset', async () => {
  const unsafePattern = /\s+on[a-z]+\s*=|javascript:/i

  for (const dir of projectDirs) {
    const blogPath = join(src, 'projects', dir, 'blog.mdx')
    if (!existsSync(blogPath)) continue

    const source = readFileSync(blogPath, 'utf8')
    assert.equal(unsafePattern.test(source), false, `${dir} contains unsafe inline MDX`)

    for (const match of source.matchAll(/image="([^"]+)"/g)) {
      assert.ok(existsSync(publicAssetPath(match[1])), `${dir} media image does not exist: ${match[1]}`)
    }
  }
})

test('map data is vendored instead of fetched from a CDN at runtime', () => {
  const mapSource = readFileSync(join(src, 'components/DottedMap.jsx'), 'utf8')
  const worldData = JSON.parse(readFileSync(join(publicDir, 'countries-110m.json'), 'utf8'))

  assert.equal(mapSource.includes('unpkg.com/world-atlas'), false)
  assert.equal(worldData.type, 'Topology')
  assert.ok(worldData.objects?.countries)
})
