import os
import unittest

import helper.toml as toml

toml_file_content = """
[blume]
slot_num = 3
max_humidity = 53
measuring_interval = 100
min_humidity = 40

[haus]
nummer = 2
name = "Haus"
"""


def file_path(filename):
    """
    Helper function to get the full path of a file in the temp directory.
    :param filename: Name of the file.
    :return: Full path to the file.
    """
    return os.path.join('temp', filename)


class TestTomlFunctions(unittest.TestCase):
    def setUp(self):
        # create a temp directory
        os.makedirs('temp', exist_ok=True)

    def tearDown(self):
        # remove the temp directory
        if os.path.exists('temp'):
            for file in os.listdir('temp'):
                os.remove(os.path.join('temp', file))
            os.rmdir('temp')

    def test_load_toml(self):
        # write file with toml content
        with open(file_path('test.toml'), 'w') as f:
            f.write(toml_file_content)
        # check if the file exists
        self.assertTrue(os.path.exists(file_path('test.toml')))
        # load the toml file
        content = toml.load_file(file_path('test.toml'))
        # check if the content is a dict
        self.assertIsInstance(content, dict)
        # check if the content has the correct keys
        self.assertIn('blume', content)
        # check if the content has the correct values
        self.assertEqual(content['blume']['slot_num'], 3)
        self.assertEqual(content['blume']['max_humidity'], 53)
        self.assertEqual(content['blume']['measuring_interval'], 100)
        self.assertEqual(content['blume']['min_humidity'], 40)
        self.assertIn('haus', content)
        self.assertEqual(content['haus']['nummer'], 2)
        self.assertEqual(content['haus']['name'], "Haus")

    def test_delete_section_file(self):
        # write file with toml content
        with open(file_path('test.toml'), 'w') as f:
            f.write(toml_file_content)
        # check if the file exists
        self.assertTrue(os.path.exists(file_path('test.toml')))
        # delete section from the toml file
        result = toml.delete_section_file(file_path('test.toml'), 'haus')
        # check if the section was deleted successfully
        self.assertTrue(result)
        # load the toml file again
        content = toml.load_file(file_path('test.toml'))
        # check if the section was deleted
        self.assertNotIn('haus', content)
        self.assertIn('blume', content)

    def test_update_section_file(self):
        # write file with toml content
        with open(file_path('test.toml'), 'w') as f:
            f.write(toml_file_content)
        # check if the file exists
        self.assertTrue(os.path.exists(file_path('test.toml')))
        # update section in the toml file
        result = toml.update_section_file(file_path('test.toml'), 'blume', 'max_humidity', 60)
        # check if the update was successful
        self.assertTrue(result)
        # load the toml file again
        content = toml.load_file(file_path('test.toml'))
        # check if the value was updated
        self.assertEqual(content['blume']['max_humidity'], 60)
        # check if the other values are still the same
        self.assertEqual(content['blume']['slot_num'], 3)
        self.assertEqual(content['blume']['measuring_interval'], 100)
        self.assertEqual(content['blume']['min_humidity'], 40)
        # check if the other section is still there
        self.assertIn('haus', content)
        self.assertEqual(content['haus']['nummer'], 2)
        self.assertEqual(content['haus']['name'], "Haus")


if __name__ == '__main__':
    unittest.main()
